---
title: 'A Property24 Scrapper' 
date: 2024-03-18
url: 'property-scrapper'
layout: 'doc'
---

![Property Scrapper](./../assets/property-scrapper.jpeg)

I built a web scrapper to help me find an apartment on [Property24](https://www.property24.com/).
It started off as a bash script that lived in my terminal, then it became a tiny Alpine container running on my PC, somewhere I deployed it to the cloud and eventually it found an unlikely home on my Android phone.
I also accidentally got my Telegram account banned, my work complex's IP temporarily blocked by Naspers and I Pavloved myself into checking rental properties whenever I get a phone notification.

Also, if you work for Property24, don't sue, you guys are great.
After many iterations and months, I found an apartment and the solution worked exceedingly well.
Every time a new apartment was listed, I got a notification on my phone and the app is opened on the new property automatically or when I clicked the notification.

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

The script now needed some dedicated compute to run on.

### Terminal

There were two versions of my terminal script. 
One that has a never ending while loop and sleep timer and the other that runs as a cron job.
Having a process run all the time was not ideal, but it was the simplist.


### Docker

My laptop would not always be available, so I needed a solution that I could run all hours of the day and to .
I was hoping to run it on 

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

## Notifications

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

At this point I was content
I had created a process that could monitor properties for me and send notifications to my phone.

Then everything changed when I woke up the next day, locked out of my Telegram account.

![Telegram Ban](./../assets/telegram.jpg)

### Termux

## Web Scrapping

### The Trap

### The

## Conclusion


## References

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