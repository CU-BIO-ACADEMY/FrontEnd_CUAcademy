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
        title: 'หน้าหลัก',
        icon: 'fa-house-blank',
        link:'/home',
        disable: true,
    },
    {
        title: 'กิจกรรม',
        icon: 'fa-chart-network',
        link:'/activity',
        disable: false,
    },
    {
        title: 'เกี่ยวกับเรา',
        icon: 'fa-circle-info',
        link:'/about',
        disable: true,
    },
    {
        title: 'เติมเครดิต',
        icon: 'fa-credit-card',
        link:'/payment',
        disable: false,
    },
    {
        title: 'ประวัติการทำธุรกรรม',
        icon: 'fa-clock',
        link:'/history',
        disable: false,
    },
    {
        title: 'โปรไฟล์',
        icon: 'fa-user',
        link:'/profile',
        disable: false,
    }
]


export const Navlinks: NavLinkitem[] = [
    {
        title: 'หน้าหลัก',
        link:'/home',
        disable: true,
        dropdown:[]
    },
    {
        title: 'กิจกรรม',
        link:'/activity',
        disable: false,
        dropdown:[]
    },
    {
        title: 'เกี่ยวกับเรา',
        link:'/about',
        disable: true,
        dropdown:[]
    },
    {
        title: 'ธุรกรรม',
        link:'/history',
        disable: false,
        dropdown:[
            {
                title:'เติมเครดิต',
                link:'/payment'
            },
            {
                title:'ประวัติการทำธุรกรรม',
                link:'/history'
            }
        ]
    },
    {
        title: 'โปรไฟล์',
        link:'/profile',
        disable: false,
        dropdown:[]
    }
]
