export interface FoodItem {
  img: string[];
  title: string;
  star: number;
  price: number;
  isSale: boolean;
}

export interface FoodTab {
  label: string;
  content: FoodItem[];
}

export interface FoodData {
  headerTitle: string;
  tabs: FoodTab[];
}

export const FOOD_TABS: FoodData = {
  headerTitle: "Thức ăn cho mèo",
  tabs: [
    {
      label: "Thức ăn cho mèo",
      content: [
        {
          img: [
            "https://bizweb.dktcdn.net/thumb/large/100/527/383/products/upload-eb792ecb6ee3495181976026c8f7017d.jpg?v=1727669769057",
            "https://bizweb.dktcdn.net/thumb/grande/100/527/383/products/upload-d2ccf62fb4394fbe8ca25e6f724d7eb5.jpg?v=1727669769057",
          ],
          title: "Thức ăn cho mèo",
          star: 4,
          price: 70000,
          isSale: false,
        },
      ],
    },
    {
      label: "Thức ăn ướt",
      content: [
        {
          img: [
            "https://bizweb.dktcdn.net/thumb/large/100/527/383/products/upload-eb792ecb6ee3495181976026c8f7017d.jpg?v=1727669769057",
            "https://bizweb.dktcdn.net/thumb/grande/100/527/383/products/upload-d2ccf62fb4394fbe8ca25e6f724d7eb5.jpg?v=1727669769057",
          ],
          title: "Thức ăn ướt cho mèo",
          star: 4,
          price: 70000,
          isSale: false,
        },
      ],
    },
    {
      label: "Snack cho mèo",
      content: [
        {
          img: [
            "https://bizweb.dktcdn.net/thumb/large/100/527/383/products/upload-eb792ecb6ee3495181976026c8f7017d.jpg?v=1727669769057",
            "https://bizweb.dktcdn.net/thumb/grande/100/527/383/products/upload-d2ccf62fb4394fbe8ca25e6f724d7eb5.jpg?v=1727669769057",
          ],
          title: "Snack cho mèo",
          star: 4,
          price: 70000,
          isSale: false,
        },
        {
          img: [
            "https://bizweb.dktcdn.net/thumb/large/100/527/383/products/upload-eb792ecb6ee3495181976026c8f7017d.jpg?v=1727669769057",
            "https://bizweb.dktcdn.net/thumb/grande/100/527/383/products/upload-d2ccf62fb4394fbe8ca25e6f724d7eb5.jpg?v=1727669769057",
          ],
          title: "Snack cho mèo",
          star: 4,
          price: 70000,
          isSale: false,
        },
        {
          img: [
            "https://bizweb.dktcdn.net/thumb/large/100/527/383/products/upload-eb792ecb6ee3495181976026c8f7017d.jpg?v=1727669769057",
            "https://bizweb.dktcdn.net/thumb/grande/100/527/383/products/upload-d2ccf62fb4394fbe8ca25e6f724d7eb5.jpg?v=1727669769057",
          ],
          title: "Snack cho mèo",
          star: 4,
          price: 70000,
          isSale: false,
        },
        {
          img: [
            "https://bizweb.dktcdn.net/thumb/large/100/527/383/products/upload-eb792ecb6ee3495181976026c8f7017d.jpg?v=1727669769057",
            "https://bizweb.dktcdn.net/thumb/grande/100/527/383/products/upload-d2ccf62fb4394fbe8ca25e6f724d7eb5.jpg?v=1727669769057",
          ],
          title: "Snack cho mèo",
          star: 4,
          price: 70000,
          isSale: false,
        },
        {
          img: [
            "https://bizweb.dktcdn.net/thumb/large/100/527/383/products/upload-eb792ecb6ee3495181976026c8f7017d.jpg?v=1727669769057",
            "https://bizweb.dktcdn.net/thumb/grande/100/527/383/products/upload-d2ccf62fb4394fbe8ca25e6f724d7eb5.jpg?v=1727669769057",
          ],
          title: "Snack cho mèo",
          star: 4,
          price: 70000,
          isSale: false,
        },
      ],
    },
  ],
};
