using API.Dtos;
using API.Errors;
using API.Extensions;
using API.Helpers;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Endpoints;

public static class ProductsEndpoints
{
    public static RouteGroupBuilder MapProductsEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/products").WithTags("Products");

        group.MapGet("/", GetProducts).WithCache(600);
        group.MapGet("/{id:int}", GetProduct).WithCache(600);
        group.MapGet("/brands", GetProductBrands).WithCache(600);
        group.MapGet("/types", GetProductTypes).WithCache(600);
        group.MapPost("/", CreateProduct).RequireAuthorization("RequireAdminRole");
        group.MapPut("/{id:int}", UpdateProduct).RequireAuthorization("RequireAdminRole");
        group.MapDelete("/{id:int}", DeleteProduct).RequireAuthorization("RequireAdminRole");
        group.MapPut("/{id:int}/photo", AddProductPhoto).RequireAuthorization("RequireAdminRole").DisableAntiforgery();
        group.MapDelete("/{id:int}/photo/{photoId:int}", DeleteProductPhoto).RequireAuthorization("RequireAdminRole");
        group.MapPost("/{id:int}/photo/{photoId:int}", SetMainPhoto).RequireAuthorization("RequireAdminRole");

        return group;
    }

    private static async Task<IResult> GetProducts(
        [AsParameters] ProductSpecParams productParams,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        var spec = new ProductsWithTypesAndBrandsSpecification(productParams);
        var countSpec = new ProductWithFiltersForCountSpecification(productParams);
        var totalItems = await unitOfWork.Repository<Product>().CountAsync(countSpec);
        var products = await unitOfWork.Repository<Product>().ListAsync(spec);
        var data = mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductToReturnDto>>(products);
        return Results.Ok(new Pagination<ProductToReturnDto>(productParams.PageIndex,
            productParams.PageSize, totalItems, data));
    }

    private static async Task<IResult> GetProduct(int id, IUnitOfWork unitOfWork, IMapper mapper)
    {
        var spec = new ProductsWithTypesAndBrandsSpecification(id);
        var product = await unitOfWork.Repository<Product>().GetEntityWithSpec(spec);
        if (product is null) return Results.NotFound(new ApiResponse(404));
        return Results.Ok(mapper.Map<Product, ProductToReturnDto>(product));
    }

    private static async Task<IResult> GetProductBrands(IUnitOfWork unitOfWork) =>
        Results.Ok(await unitOfWork.Repository<ProductBrand>().ListAllAsync());

    private static async Task<IResult> GetProductTypes(IUnitOfWork unitOfWork) =>
        Results.Ok(await unitOfWork.Repository<ProductType>().ListAllAsync());

    private static async Task<IResult> CreateProduct(
        ProductCreateDto productToCreate,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        var product = mapper.Map<ProductCreateDto, Product>(productToCreate);
        unitOfWork.Repository<Product>().Add(product);
        var result = await unitOfWork.Complete();
        if (result <= 0) return Results.BadRequest(new ApiResponse(400, "Problem creating product"));
        return Results.Ok(product);
    }

    private static async Task<IResult> UpdateProduct(
        int id,
        ProductCreateDto productToUpdate,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        var product = await unitOfWork.Repository<Product>().GetByIdAsync(id);
        mapper.Map(productToUpdate, product);
        unitOfWork.Repository<Product>().Update(product);
        var result = await unitOfWork.Complete();
        if (result <= 0) return Results.BadRequest(new ApiResponse(400, "Problem updating product"));
        return Results.Ok(product);
    }

    private static async Task<IResult> DeleteProduct(int id, IUnitOfWork unitOfWork, IPhotoService photoService)
    {
        var product = await unitOfWork.Repository<Product>().GetByIdAsync(id);
        if (product?.Photos is { })
        {
            foreach (var photo in product.Photos)
            {
                if (photo.Id > 18)
                {
                    photoService.DeleteFromDisk(photo);
                }
            }
        }

        unitOfWork.Repository<Product>().Delete(product);
        var result = await unitOfWork.Complete();
        if (result <= 0) return Results.BadRequest(new ApiResponse(400, "Problem deleting product"));
        return Results.Ok(product);
    }

    private static async Task<IResult> AddProductPhoto(
        int id,
        IFormFile? photo,
        IUnitOfWork unitOfWork,
        IMapper mapper,
        IPhotoService photoService)
    {
        var spec = new ProductsWithTypesAndBrandsSpecification(id);
        var product = await unitOfWork.Repository<Product>().GetEntityWithSpec(spec);

        if (photo?.Length <= 0) return Results.Ok(mapper.Map<Product, ProductToReturnDto>(product));
        var savedPhoto = await photoService.SaveToDiskAsync(photo);

        product?.AddPhoto(savedPhoto.PictureUrl, savedPhoto.FileName);
        if (product != null) unitOfWork.Repository<Product>().Update(product);

        var result = await unitOfWork.Complete();
        if (result <= 0) return Results.BadRequest(new ApiResponse(400, "Problem adding photo product"));

        return Results.Ok(mapper.Map<Product, ProductToReturnDto>(product));
    }

    private static async Task<IResult> DeleteProductPhoto(
        int id,
        int photoId,
        IUnitOfWork unitOfWork,
        IPhotoService photoService)
    {
        var spec = new ProductsWithTypesAndBrandsSpecification(id);
        var product = await unitOfWork.Repository<Product>().GetEntityWithSpec(spec);
        var photo = product.Photos.SingleOrDefault(x => x.Id == photoId);

        if (photo is { })
        {
            if (photo.IsMain)
            {
                return Results.BadRequest(new ApiResponse(400, "You cannot delete the main photo"));
            }

            photoService.DeleteFromDisk(photo);
        }
        else
        {
            return Results.BadRequest(new ApiResponse(400, "Photo does not exist"));
        }

        product.RemovePhoto(photoId);
        unitOfWork.Repository<Product>().Update(product);
        var result = await unitOfWork.Complete();
        if (result <= 0) return Results.BadRequest(new ApiResponse(400, "Problem adding photo product"));
        return Results.Ok();
    }

    private static async Task<IResult> SetMainPhoto(int id, int photoId, IUnitOfWork unitOfWork, IMapper mapper)
    {
        var spec = new ProductsWithTypesAndBrandsSpecification(id);
        var product = await unitOfWork.Repository<Product>().GetEntityWithSpec(spec);

        if (product.Photos.All(x => x.Id != photoId)) return Results.NotFound();

        product.SetMainPhoto(photoId);
        unitOfWork.Repository<Product>().Update(product);
        var result = await unitOfWork.Complete();
        if (result <= 0) return Results.BadRequest(new ApiResponse(400, "Problem adding photo product"));
        return Results.Ok(mapper.Map<Product, ProductToReturnDto>(product));
    }
}
