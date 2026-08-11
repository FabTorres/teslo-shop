import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@products/interfaces/product.interface';
import { JoinSizePipe } from '@products/pipes/join-sizes.pipe';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';

@Component({
  selector: 'product-table',
  imports: [ProductImagePipe, JoinSizePipe, CurrencyPipe, RouterLink],
  templateUrl: './product-table.html',
})
export class ProductTable {

  products = input.required<Product[]>();

}
