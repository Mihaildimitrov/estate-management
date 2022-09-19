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
    createAt: any;
    createBy: any;
    updateAt: any;
    updateBy: any;
}