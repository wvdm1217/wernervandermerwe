---
title: 'Property24 Web Scrapper' 
date: 2024-03-18
url: 'property-scrapper'
layout: 'doc'
---

![Property Scrapper](./../assets/property-scrapper.jpeg)

I built a web scrapper to help me find an apartment on [Property24](https://www.property24.com/).
It started off as a bash script that lived in my terminal, then it became a tiny Alpine container running on my PC, somewhere I deployed it to the cloud and eventually it found an unlikely home on my Android phone.
I also accidentally got my Telegram account banned, my office's IP temporarily blocked and I developed a Pavlovian urge to check rental properties whenever I got a phone notification.

Also, if you work for Property24, don't sue, you guys are great.
After many iterations and months, I found an apartment and the solution worked exceedingly well.
Every time a new apartment was listed, I got a notification on my phone and the app is opened on the new property automatically or when I clicked the notification.
Refer to the reference script at the bottom of the post for the final implementation.

## Moving

The last few months has been a big change for me. 
I made the decision to move back to my university town and to start a new job as a machine learning engineer.
Finding an apartment in a university town has been super painful to say the least. 
If you were not the first person to contact the realtor your chances of getting the place is slim. 
I needed a solution that would notify me of new apartments as soon as they are listed.
This sent me down a three month rabbit hole of failed apartment viewings and angry coding.

## A Humble Bash Script

After days of scrolling I decided to open up my browser developer tools to see if Property24 has an API.
All I found was an API that returned the count of properties in a given area, https://www.property24.com/search/counter.
With this all I had to do was start sampling the website for the count of properties and if the count increased since the previous sample I knew a new property has been uploaded.

```bash
response=$( \
    curl --silent \
        --location 'https://www.property24.com/search/counter' \
        -H 'content-type: application/json;' \
        --data-raw '{"propertyTypes":[4,5,6],"autoCompleteItems":[{"id":459,"name":"Stellenbosch","parentId":null,"parentName":"Western Cape","type":2,"source":0,"normalizedName":"stellenbosch"}]}' \
        --compressed
);

count=$(echo $response | jq '.count');
```

This returned a JSON object with the count of properties in Stellenbosch.
I used `jq` to parse JSON in bash.
[jq](https://jqlang.github.io/jq/) is a lightweight JSON CLI.
The count was saved in a plain text file, `count.txt`, and on a change the new count would be printed to my terminal. 
Simple I know.

## Finding the Script a Home

The sampling script now needed some dedicated compute to run on.
The biggest challenge of this project was finding a place to run a workload 24/7 for free.

### Terminal

There were two versions of my terminal script. 
One that has a never ending while loop and sleep timer and the other that runs as a cron job.
Having a process run all the time was not ideal, but it was the simplest.

### Docker

My laptop would not always be available, so I needed a solution that I could run all hours of the day and to receive notifications at any time.
The `Dockerfile` installs `curl` and `jq` and runs the bash script.

```Dockerfile
FROM alpine

RUN apk add --no-cache curl jq

COPY src/ /app/

WORKDIR /app

CMD ["/bin/sh", "script.sh"]
```

This container was miniscule. 
It is only `13MB` in size and uses `824KB` of memory.
I could probably run this thing on my fridge or my microwave.

### Cloud

I looked into running this container in the cloud somewhere. 
I could not find a service that allows for very small stateful applications to be run for free.
Azure Container Apps has a generous free tier, but it would still result in a few dollars of spend a month.

## Notifications

Setting up notifications for the application is straight forward using the [Telegram Bot API](https://core.telegram.org/bots/api).

### Telegram

```Dockerfile
function send_message() {
    local token=$1;
    local chat_id=$2;
    local text=$3;
    
    data=$( \
        jq -n \
        --arg chat_id "$chat_id" \
        --arg text "$text" \
        '{
        "chat_id": $chat_id,
        "text": $text
        }'
    )

    response=$( \
        curl --silent\
        --location "https://api.telegram.org/bot$token/sendMessage" \
        --header "Content-Type: application/json" \
        --data "$data"
    )
}
```

At this point I was content with receiving notifications on telegram.
I had created a process that could monitor properties for me and send notifications to my phone.

I woke up the next day, locked out of my Telegram account.

![Telegram Ban](./../assets/telegram.jpg)

Why? I don't know. I am still banned.

### Termux

With a need for a new notification mechanism in came [Termux](https://termux.dev/en/).
Termux is a Android terminal emulator.
It has the ability to send notifications and open applications through [Termux:API](https://wiki.termux.com/wiki/Termux:API).
It also has the benefit of being able to run bash scripts.
A phone is also always on and always connected.

This new setup replaced the previous Docker container and Telegram notifications.
It was as simple as setting up a bash script with a cronjob that runs every minute.

```bash
crontab -e
```

```bash
* * * * * ~/script.sh
```

Termux can open a URL for you using,

```bash
termux-open-url "$url";
```

You can set the Property24 app as the default app to open links to the site.
Doing this means that Termux will actually open the Property24 App.
To leave notifications for multiple properties you can run the following,

```bash
action="termux-open-url $url";

termux-notification \
--title "Property24" \
--content "$url" \
--button1 "Open" \
--button1-action "$action" \
--id "p24$url";
```

## Web Scrapping

Being notified any time a new property gets uploaded is great. 
The next step is being sent the specific property that gets uploaded.
There is no API to get the property list and it would need to be web scrapped.

Calling the web page returns the `html` for the page,
```
curl --silent \
--location "https://www.property24.com/to-rent/stellenbosch/western-cape/459/p$page?PropertyCategory=House%2cApartmentOrFlat%2cTownhouse"
```

The scraping of the site is done by looking for the unique property identifier, `data-listing-number` using the following script,

```bash
page=1
response=$(
    curl --silent \
    --location "https://www.property24.com/to-rent/stellenbosch/western-cape/459/p$page?PropertyCategory=House%2cApartmentOrFlat%2cTownhouse"
)

list=$(grep -o 'data-listing-number="[0-9]*"' <<< "$response" | cut -d '"' -f 2)
```

This list contains replicas and needs to be reduced to a set.
Finding the property URL given each listing number in the set is then done as follows,
```bash
number=114566509
base_url="https://www.property24.com"
url=$base_url$( grep "/to-rent/.*/$number" <<< "$response" | cut -d '"' -f 2)
```

### The Trap

The list of property URLS contained 21 properties even if the `html` only showed 20 properties per page.

<iframe src="https://giphy.com/embed/Z1LYiyIPhnG9O" width="480" height="259" style="" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>

When I clicked on the links in the page it seemed to be working. 
One of the links however caused everything to stop working.
I had zero connection to Property24 and any Naspers site.

The must have blacklisted my IP.
To make it a bit worse neither did anyone in my office.
The blacklisting was only temporary and resolved after an hour.
At least now you know how to get your co-workers off of News24 when they should be working.

### The Solution

Upon inspection the list of 21 property URLS was a list of 20 valid URLs that lead to a property listing and one, which looks real, but that gets you blacklisted.
It looks like a historic link that gets used since nothing in the link gives it away as a fake link.

If you scrape the page a second time you now get 21 URLs, with 20 having appeared in the previous list and the trap URL being different.
The intersection of the first and second set gives a set of 20 valid URLs.

```bash
array1=( $first_list )
array2=( $second_list )
common_numbers=()

for num1 in "${array1[@]}"; do
    for num2 in "${array2[@]}"; do
        if [[ "$num1" = "$num2" ]]; then
            if [[ ! " ${common_numbers[@]} " =~ " $num1 " ]]; then
                common_numbers+=("$num1")
            fi
            break
        fi
    done
done
```

The list of all properties is now within grasp by iterating over all pages.
This list is saved every time a new property gets added or deleted using the count scraping method.
This saves computation since it is not necessary to scrape the web page every minute, only every minute that the count changed.
The difference between the old and new sets of URLs are the newly uploaded properties.


## Conclusion

This was a long iterative side project. 
I could have never predicted the final working bash web scrapper.
Unlike many side projects this ended up not being a complete waste of time.
The end result of finding the perfect apartment meant it was all worth it.

## References Script

- 
```
#!/bin/bash

cd "$(dirname "$0")";

if [ -f count.txt ]; then
    prev_count=$(cat count.txt);
else
    prev_count=0;
fi

response=$( \

    curl --silent \
    --location 'https://www.property24.com/search/counter' \
    -H 'content-type: application/json;' \
    --data-raw '{"bedrooms":0,"bathrooms":0,"availability":0,"rentalRates":[],"sizeFrom":{"isCustom":false,"value":null},"sizeTo":{"isCustom":false,"value":null},"erfSizeFrom":{"isCustom":false,"value":null},"erfSizeTo":{"isCustom":false,"value":null},"floorSizeFrom":{"isCustom":false,"value":null},"floorSizeTo":{"isCustom":false,"value":null},"parkingType":1,"parkingSpaces":0,"hasFlatlet":null,"hasGarden":null,"hasPool":null,"furnishedStatus":2,"isPetFriendly":null,"isRepossessed":null,"isRetirement":null,"isInSecurityEstate":null,"onAuction":null,"onShow":null,"propertyTypes":[4,5,6],"autoCompleteItems":[{"id":459,"name":"Stellenbosch","parentId":null,"parentName":"Western Cape","type":2,"source":0,"normalizedName":"stellenbosch"}],"searchContextType":1,"priceFrom":{"isCustom":false,"value":null},"priceTo":{"isCustom":false,"value":null},"searchType":1,"sortOrder":0,"developmentSubType":0}' \
    --compressed

);

count=$(echo $response | jq '.count');
echo $count > count.txt;

if [ $count -ne $prev_count ]; then
    message="Change in count: $count";
    echo "$message";
else
    echo "No change in count. Exiting.";
    exit 1;
fi


echo "Number of properties: $count" ;

pages=$(( $count / 20 ));


if ((count % 20 > 0)); then
    pages=$(( $pages + 1 ))
fi

echo "Number of pages: $pages";

file="listing.txt"
old_file="old.txt"
new_file="new.txt"
base_url="https://www.property24.com"
total=0

cat $file > $old_file;
cat /dev/null > $file;
cat /dev/null > $new_file;

for ((page=1; page<=pages; page++)); do
    echo "Processing page: $page";

    response=$(

        curl --silent \
        --location "https://www.property24.com/to-rent/stellenbosch/western-cape/459/p$page?PropertyCategory=House%2cApartmentOrFlat%2cTownhouse"

    )

    first_list=$(grep -o 'data-listing-number="[0-9]*"' <<< "$response" | cut -d '"' -f 2)

    response=$(

        curl --silent \
        --location "https://www.property24.com/to-rent/stellenbosch/western-cape/459/p$page?PropertyCategory=House%2cApartmentOrFlat%2cTownhouse"

    )

    second_list=$(grep -o 'data-listing-number="[0-9]*"' <<< "$response" | cut -d '"' -f 2)

    array1=( $first_list )
    array2=( $second_list )
    common_numbers=()

    for num1 in "${array1[@]}"; do
        for num2 in "${array2[@]}"; do
            if [[ "$num1" = "$num2" ]]; then
                if [[ ! " ${common_numbers[@]} " =~ " $num1 " ]]; then
                    common_numbers+=("$num1")
                fi
                break
            fi
        done
    done

    i=0;
    for number in "${common_numbers[@]}" ; do
        url=$base_url$( grep "/to-rent/.*/$number" <<< "$response" | cut -d '"' -f 2)
        echo $url >> $file
        i=$(($i + 1))
    done
    total=$(($total+$i))
    echo "Total: $total, count: $i"

done

if [[ ! "$total" = "$count" ]]; then
    echo "Count is wrong";
else
    echo "All properties processed";
    old_urls=($(cat old.txt))
    new_urls=($(cat listing.txt))

    newly_added_urls=()
    for url in "${new_urls[@]}"; do
        if [[ ! " ${old_urls[@]} " =~ " $url " ]]; then
            newly_added_urls+=("$url")
        fi
    done

    if [[ ${#newly_added_urls[@]} -gt 0 ]]; then
        echo "Newly added URLs:";
        echo "${newly_added_urls[@]}";
        url="${newly_added_urls[@]}";
        action="termux-open-url $url";

        termux-notification \
        --title "Property24" \
        --content "$url" \
        --button1 "Open" \
        --button1-action "$action" \
        --id "p24$url";


        termux-open-url "$url";
        echo "${newly_added_urls[@]}" >> "$new_file"
    else
        echo "No newly added URLs found.";
    fi
fi
```