export interface FoodTab {
  label: string;
  key: string;
}

export interface FoodData {
  headerTitle: string;
  tabs: FoodTab[];
}

export const FOOD_TABS: FoodData = {
  headerTitle: "Thức ăn cho thú cưng",
  tabs: [
    {
      label: "Thức ăn cho mèo",
      key: "cat-food",
    },
    {
      label: "Thức ăn cho chó",
      key: "dog-food",
    },
    {
      label: "Đồ chơi",
      key: "toys",
    },
  ],
};
