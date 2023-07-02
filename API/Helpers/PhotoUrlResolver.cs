using API.Dtos;
using AutoMapper;
using Core.Entities;

namespace API.Helpers;

public class PhotoUrlResolver(IConfiguration config) : IValueResolver<Photo, PhotoToReturnDto, string>
{
    public string? Resolve(Photo source, PhotoToReturnDto destination, string destMember, ResolutionContext context)
    {
        if (!string.IsNullOrEmpty(source.PictureUrl))
        {
            return config["ApiUrl"] + source.PictureUrl;
        }

        return null;
    }
}
