import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Products } from "./products.entity";

@Entity("productcategories", { schema: "yenreach" })
export class ProductCategory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    category_string: string;
 
    @Column({ unique: true })
    category: string;

    @Column({ default: "category added by user" })
    details: string;

    @ManyToMany(() => Products, (product) => product.categories)
    products: Products[];

    @CreateDateColumn({ type: "integer", name: "created" })
    created: Date;

    @UpdateDateColumn({ type: "integer", name: "last_updated" })
    lastUpdated: Date;
}