//É uma espécie de seeder para o banco de dados

import { Category, Prisma } from "../../generated/prisma/client.js";
import { TransactionType } from "../../generated/prisma/enums.js";
import prisma from '../config/prisma.js'
//pedir ao chat pra explicar oq ta acontecendo KKKK

type GlobalCategoryInput = Pick<Category,"name"|"color"|"type">

//estou tipando a variável globalCategories como 'GlobalCategoryInput'
const globalCategories: GlobalCategoryInput[] = [
  // Despesas
  { name: "Alimentação", color: "#FF5733", type: TransactionType.expense },
  { name: "Transporte", color: "#33A8FF", type: TransactionType.expense },
  { name: "Moradia", color: "#33FF57", type: TransactionType.expense },
  { name: "Saúde", color: "#F033FF", type: TransactionType.expense },
  { name: "Educação", color: "#FF3366", type: TransactionType.expense },
  { name: "Lazer", color: "#FFBA33", type: TransactionType.expense },
  { name: "Compras", color: "#33FFF6", type: TransactionType.expense },
  { name: "Outros", color: "#B033FF", type: TransactionType.expense },

  // Receitas
  { name: "Salário", color: "#33FF57", type: TransactionType.income },
  { name: "Freelance", color: "#33A8FF", type: TransactionType.income },
  { name: "Investimentos", color: "#FFBA33", type: TransactionType.income },
  { name: "Outros", color: "#B033FF", type: TransactionType.income },
];

//aqui estamos informando que a nossa função espera-se que seja retornado uma promise que é uma array de category
export const initializeCategoriesDefault = async ():Promise<Category[]> =>{
    //aqui podemos ver que o valor que vamos retornar confere com o valor que a função espera que seja retornado
    const createdCategories:Category[] = []

    for(const categorie of globalCategories){
        try {
            const existing = await prisma.category.findFirst({
                where:{
                    name:categorie.name,
                    type:categorie.type,
                    }
                })
                if(!existing){
                    const newCategorie = await prisma.category.create({data:categorie})
                    // console.log(newCategorie)
                    createdCategories.push(newCategorie)
                }else{
                    createdCategories.push(existing)
                }
            }
        catch (err) {
            console.error(err)
        }
    }

    return createdCategories;
}
