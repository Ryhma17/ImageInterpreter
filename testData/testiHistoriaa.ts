
export interface HistoryItemType {
    id: string;
    image: any; 
    date: string;
    location: string;
    title: string;
    subtitle: string;
}

export const TESTI_HISTORIA: HistoryItemType[] = [
    {
        id: '1',
        image: require('../Documents/UI design/Analyze.png'), 
        date: 'Today, 2:30 PM',
        location: 'The Amazon jungle',
        title: 'Identify the plant',
        subtitle: 'IT\'S PEIKONLEHTI, which is a typical houseplant',
    },
    {
        id: '2',
        image: require('../Documents/UI design/DetailsModal.png'),
        date: 'Yesterday, 10:15 AM',
        location: '',
        title: 'Identify the food',
        subtitle: 'Seems to be a good looking hamburger',
    },
    {
        id: '3',
        image: require('../Documents/UI design/HistoryPage.png'),
        date: 'Jan 10, 5:45 PM',
        location: '',
        title: 'What kind of dog is this?',
        subtitle: 'It looks like a Golden Retriever puppy.',
    },
{
        id: '4',
        image: require('../Documents/UI design/HistoryPage.png'),
        date: 'Jan 08, 2:15 PM',
        location: 'Helsinki, Finland',
        title: 'What building is this?',
        subtitle: 'This is the Helsinki Cathedral (Helsingin tuomiokirkko), a famous landmark.',
    },
    {
        id: '5',
        image: require('../Documents/UI design/HistoryPage.png'),
        date: 'Jan 05, 9:30 AM',
        location: 'Garage',
        title: '"Diagnose this dashboard light"',
        subtitle: 'The symbol indicates low tire pressure. You should check your tires.',
    },
    {
        id: '6',
        image: require('../Documents/UI design/HistoryPage.png'),
        date: 'Dec 28, 8:45 PM',
        location: 'Library',
        title: 'Summarize this page',
        subtitle: 'The text discusses the history of Finland',
    },
    {
        id: '7',
        image: require('../Documents/UI design/HistoryPage.png'),
        date: 'Dec 24, 6:00 PM',
        location: 'Kitchen',
        title: 'Recipe for these ingredients',
        subtitle: 'Based on the image (eggs, flour, milk), you can make pancakes or waffles.',
    },
    {
        id: '8',
        image: require('../Documents/UI design/HistoryPage.png'),
        date: 'Dec 20, 11:20 AM',
        location: 'Forest',
        title: 'Is this mushroom poisonous?',
        subtitle: 'Caution: This looks like a Fly Agaric (Amanita muscaria). It is toxic.',
    },
];