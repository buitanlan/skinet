using System.Text.Json;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data;

public class StoreContextSeed
{
    public static async Task SeedAsync(StoreContext context, ILoggerFactory loggerFactory)
    {
        try
        {
            if (!context.ProductBrands.Any())
            {
                var brandsData = await File.ReadAllTextAsync("../Infrastructure/Data/SeedData/brands.json");
                var brands = JsonSerializer.Deserialize<List<ProductBrand>>(brandsData);
                await context.ProductBrands.AddRangeAsync(brands);
            }
            if (!context.ProductTypes.Any())
            {
                var typesData = await File.ReadAllTextAsync("../Infrastructure/Data/SeedData/types.json");
                var types = JsonSerializer.Deserialize<List<ProductType>>(typesData);
                await context.ProductTypes.AddRangeAsync(types);
            }
            if (!context.Products.Any())
            {
                var productsData = await File.ReadAllTextAsync("../Infrastructure/Data/SeedData/products.json");
                var products = JsonSerializer.Deserialize<List<ProductSeedModel>>(productsData);
                foreach (var item in products)
                {
                    var pictureFileName = item.PictureUrl.Substring(16);
                    var product = new Product
                    {
                        Name = item.Name,
                        Description = item.Description,
                        Price = item.Price,
                        ProductBrandId = item.ProductBrandId,
                        ProductTypeId = item.ProductTypeId
                    };
                    product.AddPhoto(item.PictureUrl, pictureFileName);
                    context.Products.Add(product);
                }
            }
            if (!context.DeliveryMethods.Any())
            {
                var dmData = await File.ReadAllTextAsync("../Infrastructure/Data/SeedData/delivery.json");

                var methods = JsonSerializer.Deserialize<List<DeliveryMethod>>(dmData);
                await context.DeliveryMethods.AddRangeAsync(methods);

            }
            await context.SaveChangesAsync();


        }
        catch (Exception ex)
        {
            var logger = loggerFactory.CreateLogger<StoreContextSeed>();
            logger.LogInformation(ex.Message);
        }
    }
}
