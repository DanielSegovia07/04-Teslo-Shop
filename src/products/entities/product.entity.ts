import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from './product-image.entity';
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";


@Entity({name : 'products'})
export class Product {

    @ApiProperty({
        example: '36ce4056-cf7b-4d2c-932f-9b2ddb62ff47',
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id : string;

    @ApiProperty({
        example: 'T-shirt Tesla ',
        description: 'Product title',
        uniqueItems: true
    })
    @Column('text',{
        unique: true,
    })
    title : string;

    @ApiProperty({
        example: '0',
        description: 'Product price',
        uniqueItems: false
    })
    @Column('float',{
        default : 0
    })
    price: number;

    @ApiProperty({
        example: 'Anim reprehenderit nulla in anim mollit minim irure comodo',
        description: 'Product description',
        uniqueItems: false,
        default: null
    })
    @Column({
        type:'text',
        nullable : true
    })
    description: string;

    @ApiProperty({
        example: 'T-shirt_Tesla',
        description: 'Product slug',
        uniqueItems: true
    })
    @Column('text',{
        unique: true
    })
    slug: string;

    @ApiProperty({
        example: 10,
        description: 'Product stock',
        default: 0
    })
    @Column('int',{
        default: 0
    })
    stock: number;

    @ApiProperty({
        example: ['M','L','XL','XLL'],
        description: 'Product size',
        
    })
    @Column('text',{
        array : true 
    })
    sizes: string[];

    @ApiProperty({
        example: 'women',
        description: 'Product gender',
        default: 0
    })
    @Column('text')
    gender: string;

    @ApiProperty({
        example: ['Shirts','Tesla'],
        description: 'Product tags',
        default: 0
    })
    @Column('text',{
        array: true,
        default: []
    })
    tags: string[]

    @ApiProperty({
        example: 'producto.png',
        description: 'Product image',
        default: 0
    })
    @OneToMany(
        () => ProductImage,
        (ProductImage) => ProductImage.product,
        { cascade : true, eager : true}
    )
    images?: ProductImage[];


    @ManyToOne(
        () => User,
        (user) => user.product,
        {eager : true}
    )
    user: User

    @BeforeInsert()
    checkSlugInsert(){
        if (!this.slug) {
            this.slug = this.title
        }

        this.slug = this.slug
        .toLowerCase()
        .replaceAll(' ','_')
        .replaceAll("'",'')
    }

    @BeforeUpdate()
    heckSlugInsert(){
        if (!this.slug) {
            this.slug = this.title
        }

        this.slug = this.slug
        .toLowerCase()
        .replaceAll(' ','_')
        .replaceAll("'",'')
    }

}