using Core.Entities;

namespace Core.Specifications
{
    public class ProductsWithTypesAndBrandsSpecification : BaseSpecification<Product>
    {
        public ProductsWithTypesAndBrandsSpecification()
        {
            AddIncluded(x => x.ProductType);
            AddIncluded(x => x.ProductBrand);
        }
        public ProductsWithTypesAndBrandsSpecification(int id) : base(x=>x.Id==id)
        {
            AddIncluded(x => x.ProductType);
            AddIncluded(x => x.ProductBrand);
        }
    }
}