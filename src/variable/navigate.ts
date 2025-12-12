interface SideLinkitem{
    title:string;
    icon:string;
    link:string;
}

interface Dropdown{
    title:string;
    link:string;
}

interface NavLinkitem{
    title:string;
    icon:string;
    link:string;
    dropdown:Dropdown[]
}

export const Sidelinks: SideLinkitem[] = [
    {
        title: 'หน้าหลัก',
        icon: 'fa-house-blank',
        link:'/home'
    },
    {
        title: 'กิจกรรม',
        icon: 'fa-chart-network',
        link:'/activity'
    },
    {
        title: 'เกี่ยวกับเรา',
        icon: 'fa-circle-info',
        link:'/about'
    },
    {
        title: 'เติมเครดิต',
        icon: 'fa-credit-card',
        link:'/payment'
    },
    {
        title: 'ประวัติการทำธุรกรรม',
        icon: 'fa-clock',
        link:'/history'
    }
]


export const Navlinks: NavLinkitem[] = [
    {
        title: 'หน้าหลัก',
        link:'/home',
        dropdown:[]
    },
    {
        title: 'กิจกรรม',
        link:'/activity',
        dropdown:[]
    },
    {
        title: 'เกี่ยวกับเรา',
        link:'/about',
        dropdown:[]
    },
    {
        title: 'ธุรกรรม',
        link:'/history',
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
    }
]
