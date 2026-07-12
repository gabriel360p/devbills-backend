import { TransactionType } from "../../generated/prisma/enums"
import { CategorySummary } from "./categorie.type"

//crinado um tipo/interface
export interface TransactionsFilter{
    userId:string, //campo do objeto obrigatório
    categoryId?:string,//campo opcional
    type?:TransactionType
    date?:{
        gte:Date,//litamente é: >=    ->maior ou igual
        lte:Date//<=      ->menor ou igual
    },
}
export interface TransactionSummary{
    totalExpense:number,
    totalIncome:number,
    balance:number,
    expesesByCategory:CategorySummary[];
}
