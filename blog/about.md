---
layout: 'page'
---

<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamPageSection,
  VPTeamMembers
} from 'vitepress/theme'

const about = `I have a deep-rooted enthusiasm for problem solving and a love for collaboration. 
I am committed to building innovative machine learning solutions that run at scale.
My background is in electronic engineering, including a research-based masters in speech and language technologies. 
My focus areas are machine learning, software engineering and cloud computing.`


const members = [
  {
    avatar: './profile.jpg',
    name: 'Werner van der Merwe',
    title: 'Machine Learning Engineer',
    desc: about,
    org: 'Spatialedge',
    orgLink: 'https://spatialedge.ai',
    links: [
      { icon: 'github', link: 'https://github.com/wvdm1217' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/werner-van-der-merwe/' },
      { icon: 'twitter', link: 'https://twitter.com/WernervanderMe6'}
    ]
  }
]


</script>


<!-- <VPTeamMembers size="small" :members="members" /> -->

<VPTeamPage >
  <VPTeamPageTitle>
    <template #title>
      About Me
    </template>
    <!-- <template #lead>
      {{ about }}
    </template> -->
  </VPTeamPageTitle>
  <VPTeamMembers
    :members="members"
  />
  <!-- <VPTeamPageSection>
    <template #members>
      <VPTeamMembers
        :members="members"
      />
    </template>
    <template #lead>
      {{ about }}
    </template>
  </VPTeamPageSection> -->
</VPTeamPage>

