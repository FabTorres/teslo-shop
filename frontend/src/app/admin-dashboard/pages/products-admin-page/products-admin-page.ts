import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router, ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { ProductTable } from "@products/components/product-table/product-table";
import { ProductsService } from '@products/services/products.service';
import { Pagination } from '@shared/components/pagination/pagination';
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTable, Pagination, RouterLink],
  templateUrl: './products-admin-page.html',
})
export class ProductsAdminPage {

  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  productsPerPage = signal(10);

  productsResource = rxResource({
    params: () => ({ page: this.paginationService.currentPage() - 1, limit: this.productsPerPage() }),
    stream: ({ params }) => this.productsService.getProducts({
      offset: params.page * params.limit,
      limit: params.limit
    }),
  });

  onLimitChange(limit: number) {
    this.productsPerPage.set(limit);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: 1 },
    });
  }

}
