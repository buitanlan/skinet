using API.Dtos;
using AutoMapper;
using Core.Entities;

namespace API.Helpers;

public class ProductUrlResolver : IValueResolver<Product, ProductToReturnDto, string>
{
    private readonly IConfiguration _config;
    public ProductUrlResolver(IConfiguration config)
    {
        _config = config;
    }
    public string Resolve(Product source, ProductToReturnDto destination, string destMember, ResolutionContext context)
    {
        // if(!string.IsNullOrEmpty(source.PictureUrl))
        // {
        //     return _config["ApiUrl"] +source.PictureUrl;
        // }
        // return null;
        var photo = source.Photos.FirstOrDefault(x => x.IsMain);

        if (photo is { })
        {
            return _config["ApiUrl"] + photo.PictureUrl;
        }
        return _config["ApiUrl"] + "images/products/placeholder.png";
    }
}
