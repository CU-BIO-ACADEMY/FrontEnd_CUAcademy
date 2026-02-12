interface SideLinkitem{
    title:string;
    icon:string;
    link:string;
    disable:boolean;
}

interface Dropdown{
    title:string;
    link:string;
}

interface NavLinkitem{
    title:string;
    icon?:string;
    link:string;
    disable:boolean;
    dropdown:Dropdown[]
}

export const Sidelinks: SideLinkitem[] = [
    {
        title: 'กิจกรรม',
        icon: 'fa-chart-network',
        link:'/activity',
        disable: false,
    },
    {
        title: 'เกี่ยวกับเรา',
        icon: 'fa-circle-info',
        link: '/about',
        disable: false,
    },
    {
        title: 'เติมเครดิต',
        icon: 'fa-credit-card',
        link:'/payment',
        disable: true,
    },
    {
        title: 'ประวัติการทำธุรกรรม',
        icon: 'fa-clock',
        link:'/history',
        disable: true,
    },
    {
        title: 'โปรไฟล์',
        icon: 'fa-user',
        link:'/profile',
        disable: false,
    },
    {
        title: 'จัดการระบบ',
        icon: 'fa-shield-halved',
        link:'/admin',
        disable: false,
    },
]


export const Navlinks: NavLinkitem[] = [
    {
        title: 'กิจกรรม',
        link:'/activity',
        disable: false,
        dropdown:[]
    },
    {
        title: 'เกี่ยวกับเรา',
        link:'/about',
        disable: false,
        dropdown:[]
    },
    // {
    //     title: 'ธุรกรรม',
    //     link:'/history',
    //     disable: true,
    //     dropdown:[
    //         {
    //             title:'เติมเครดิต',
    //             link:'/payment'
    //         },
    //         {
    //             title:'ประวัติการทำธุรกรรม',
    //             link:'/history'
    //         }
    //     ]
    // },
    {
        title: 'โปรไฟล์',
        link:'/profile',
        disable: false,
        dropdown:[]
    },
    {
        title: 'จัดการระบบ',
        dropdown:[],
        link:'/admin',
        disable: false,
    },
]
