using API.Dtos;
using AutoMapper;
using Core.Entities;

namespace API.Helpers;

public class ProductUrlResolver(IConfiguration config) : IValueResolver<Product, ProductToReturnDto, string>
{
    public string Resolve(Product source, ProductToReturnDto destination, string destMember, ResolutionContext context)
    {
        var photo = source.Photos.FirstOrDefault(x => x.IsMain);

        if (photo is not null)
        {
            return config["ApiUrl"] + photo.PictureUrl;
        }
        return config["ApiUrl"] + "images/products/placeholder.png";
    }
}
