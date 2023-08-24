import * as AppData from "./controller/AddData";
import * as GetData from "./controller/GetData";
import * as ModifyData from "./controller/ModifyData";

/**
 * All application routes.
 */
export const AppRoutes = [
    {
        path: "/addCard",
        method: "post",
        action: AppData.addCard
    },
    {
        path: "/addCustomer",
        method: "post",
        action: AppData.addCustomer
    },
    {
        path: "/addGate",
        method: "post",
        action: AppData.addGate
    },
    {
        path: "/addTicketType",
        method: "post",
        action: AppData.addTicketType
    },
    {
        path: "/addReader",
        method: "post",
        action: AppData.addReader
    },
    {
        path: "/addTicketTypeGate",
        method: "post",
        action: AppData.addTicketTypeGate
    },
    {
        path: "/addCustomerCardTicketType",
        method: "post",
        action: AppData.addCustomerCardTicketType
    },
    {
        path: "/getCardList",
        method: "get",
        action: GetData.getCardList
    },
    // {
    //     path: "/getCustomerList"
    // },
    {
        path: "/getGateList",
        method: "get",
        action: GetData.getGateList
    },
    {
        path: "/getTicketTypeList",
        method: "get",
        action: GetData.getTicketTypeList
    },
    {
        path: "/updateCard",
        method: "put",
        action: ModifyData.updateCard
    }
];