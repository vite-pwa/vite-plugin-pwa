export interface SocialEntry {
  icon: string
  link: string
}

export interface CoreTeam {
  avatar: string
  name: string
  // required to download avatars from GitHub
  github: string
  twitter: string
  sponsor?: string
  title?: string
  org?: string
  desc?: string
  links?: SocialEntry[]
}

const createLinks = (tm: CoreTeam): CoreTeam => {
  tm.links = [
    { icon: 'github', link: `https://github.com/${tm.github}` },
    { icon: 'twitter', link: `https://twitter.com/${tm.twitter}` },
  ]
  return tm
}

const plainTeamMembers = [
  {
    avatar: '/team-avatars/antfu.png',
    name: 'Anthony Fu',
    github: 'antfu',
    twitter: 'antfu7',
    sponsor: 'https://github.com/sponsors/antfu',
    title: 'A fanatical open sourceror, working',
    org: 'NuxtLabs',
    desc: 'Core team member of Vite & Vue',
  },
  {
    avatar: '/team-avatars/userquin.png',
    name: 'Joaquín Sánchez',
    github: 'userquin',
    twitter: 'userquin',
    title: 'A fullstack and android developer',
    desc: 'Vite\'s fanatical follower',
  },
  {
    avatar: '/team-avatars/hannoeru.png',
    name: 'ハン / Han',
    github: 'hannoeru',
    twitter: 'hannoeru',
    title: 'Student / Front-End Engineer',
    desc: '@windi_css member',
  },
]

const teamMembers = plainTeamMembers.map(tm => createLinks(tm))

export { teamMembers }
