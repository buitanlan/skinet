using Core.Entities;

namespace Core.Specifications
{
    public class ProductsWithTypesAndBrandsSpecification : BaseSpecification<Product>
    {
        public ProductsWithTypesAndBrandsSpecification(string sort)
        {
            AddIncluded(x => x.ProductType);
            AddIncluded(x => x.ProductBrand);
            AddOrderBy(x => x.Name);
            if (!string.IsNullOrEmpty(sort))
            {
                switch (sort)
                {
                    case "priceAcs":
                        AddOrderBy(p => p.Price);
                        break;
                    case "priceDesc":
                        AddOrderByDescending(p => p.Price);
                        break;
                    default:
                        AddOrderBy(p => p.Name);
                        break;
                }
            }
        }
        public ProductsWithTypesAndBrandsSpecification(int id) : base(x=>x.Id==id)
        {
            AddIncluded(x => x.ProductType);
            AddIncluded(x => x.ProductBrand);
        }
    }
}