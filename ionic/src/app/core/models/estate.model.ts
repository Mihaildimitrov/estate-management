export interface IEstate {
    id: string;
    title: string;
    description: string;
    address: string;
    area: number;
    buyPrice: number;
    soldPrice: number;
    active: boolean;
    activeSell: boolean;
    sold: boolean;
    notary: string;
    houseManagerName: string;
    houseManagerPhone: number;

    notaryBuyTax: number;
    notarySellTax: number;
    brokerCommissionPercentages: number;
    brokerBuyCommission: number;
    brokerSellCommission: number;

    createAt: any;
    createBy: any;
    updateAt: any;
    updateBy: any;
}