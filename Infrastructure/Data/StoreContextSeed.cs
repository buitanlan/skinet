using System.Text.Json;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Serilog;

namespace Infrastructure.Data;

public class StoreContextSeed
{
    public static async Task SeedAsync(StoreContext context)
    {
        try
        {
            if (!await context.ProductBrands.AnyAsync())
            {
                var brandsData = await File.ReadAllTextAsync("../Infrastructure/Data/SeedData/brands.json");
                var brands = JsonSerializer.Deserialize<List<ProductBrand>>(brandsData);
                if (brands != null) await context.ProductBrands.AddRangeAsync(brands);
            }
            if (!await context.ProductTypes.AnyAsync())
            {
                var typesData = await File.ReadAllTextAsync("../Infrastructure/Data/SeedData/types.json");
                var types = JsonSerializer.Deserialize<List<ProductType>>(typesData);
                if (types != null) await context.ProductTypes.AddRangeAsync(types);
            }
            if (!await context.Products.AnyAsync())
            {
                var productsData = await File.ReadAllTextAsync("../Infrastructure/Data/SeedData/products.json");
                var products = JsonSerializer.Deserialize<List<ProductSeedModel>>(productsData);
                if (products != null)
                    foreach (var item in products)
                    {
                        var pictureFileName = item.PictureUrl?[16..];
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
            if (!await context.DeliveryMethods.AnyAsync())
            {
                var dmData = await File.ReadAllTextAsync("../Infrastructure/Data/SeedData/delivery.json");

                var methods = JsonSerializer.Deserialize<List<DeliveryMethod>>(dmData);
                if (methods != null) await context.DeliveryMethods.AddRangeAsync(methods);
            }
            await context.SaveChangesAsync();


        }
        catch (Exception ex)
        {
            Log.Fatal(ex.Message);
        }
    }
}
