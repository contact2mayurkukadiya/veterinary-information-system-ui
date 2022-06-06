import {INavData} from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'ПОЧЕТНА',
    url: ''
  },
  {
    name: 'КОПИТАРИ',
    children: [
      {
        name: 'Тип газдинства',
        url: '/dashboard/tip-gazdinstva',
      },
      {
        name: 'Намена копитара',
        url: '/dashboard/namena-kopitara',
      },
      {
        name: 'Раса копитара',
        url: '/dashboard/rasa-kopitara',
      },
      {
        name: 'Држалац копитара',
        children: [
          {
            name: 'Профил држалаца копитара',
            url: '/dashboard/drzalac-kopitara/profil',
          },
          {
            name: 'Регистар држалаца копитара',
            url: '/dashboard/drzalac-kopitara/registar',
          }
        ]
      },
      {
        name: 'Власник копитара',
        children: [
          {
            name: 'Профил власника копитара',
            url: '/dashboard/vlasnik-kopitara/profil',
          },
          {
            name: 'Регистар власника копитара',
            url: '/dashboard/vlasnik-kopitara/registar',
          }
        ]
      },
      {
        name: 'Регистар копитара',
        children: [
          {
            name: 'Профил копитара',
            url: '/dashboard/kopitari/profil',
          },
          {
            name: 'Регистар копитара',
            url: '/dashboard/kopitari/registar',
          }
        ]
      }
    ]
  }
];
