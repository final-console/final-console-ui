const menuData = [
    {
        key: '-1',
        name: '首页',
        path: '-1',
    },
    {
        key: 'A',
        name: 'A',
        path: 'A',
        children: [
            {
                key: 'A1',
                name: 'A1',
                path: 'A/A1',
                children: [
                    {key: 'A11', name: 'A11', path: 'A/A1/A11'},
                    {key: 'A12', name: 'A12', path: 'A/A1/A12'},
                ],
            },
            {
                key: 'A2',
                name: 'A2',
                path: 'A/A2',
                children: [
                    {key: 'A21', name: 'A21', path: 'A/A2/A21'},
                    {key: 'A22', name: 'A22', path: 'A/A2/A22'},
                ],
            },
        ],
    },
    {
        key: 'B',
        name: 'B',
        path: 'B',
        children: [
            {
                key: 'B1',
                name: 'B1',
                path: 'B/B1',
                children: [
                    {key: 'B11', name: 'B11', path: 'B/B1/B11'},
                    {key: 'B12', name: 'B12', path: 'B/B1/B12'},
                ],
            },
            {
                key: 'B2',
                name: 'B2',
                path: 'B/B2',
                children: [
                    {key: 'B21', name: 'B21', path: 'B/B2/B21'},
                    {key: 'B22', name: 'B22', path: 'B/B2/B22'},
                ],
            },
        ],
    },
];

export default menuData;
