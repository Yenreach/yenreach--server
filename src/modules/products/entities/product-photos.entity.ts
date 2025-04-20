import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Products } from "./products.entity";

@Entity("productphotos")
export class ProductPhoto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    filename: string;

    @ManyToOne(() => Products, (product) => product.photos)
    product: Products;

    // @CreateDateColumn({ type: "timestamp", name: "created" })
    @CreateDateColumn({ type: "integer", name: "created" })
    created: Date;

    @UpdateDateColumn({ type: "integer", name: "last_updated" })
    lastUpdated: Date;
}
