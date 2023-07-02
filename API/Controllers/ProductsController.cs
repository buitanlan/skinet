using API.Dtos;
using API.Errors;
using API.Helpers;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ProductsController(IUnitOfWork unitOfWork, IMapper mapper, IPhotoService photoService) : BaseApiController
{
    [Cached(600)]
    [HttpGet]
    public async Task<ActionResult<Pagination<ProductToReturnDto>>> GetProducts(
        [FromQuery] ProductSpecParams productParams)
    {
        var spec = new ProductsWithTypesAndBrandsSpecification(productParams);
        var countSpec = new ProductWithFiltersForCountSpecification(productParams);
        var totalItems = await unitOfWork.Repository<Product>().CountAsync(countSpec);
        var products = await unitOfWork.Repository<Product>().ListAsync(spec);
        var data = mapper
            .Map<IReadOnlyList<Product>, IReadOnlyList<ProductToReturnDto>>(products);
        return Ok(new Pagination<ProductToReturnDto>(productParams.PageIndex,
        productParams.PageSize, totalItems, data));
    }


    [Cached(600)]
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProductToReturnDto>> GetProduct(int id)
    {
        var spec = new ProductsWithTypesAndBrandsSpecification(id);
        var product = await unitOfWork.Repository<Product>().GetEntityWithSpec(spec);
        if (product is null) return NotFound(new ApiResponse(404));
        return mapper.Map<Product, ProductToReturnDto>(product);
    }


    [Cached(600)]
    [HttpGet("brands")]
    public async Task<ActionResult<IReadOnlyList<ProductBrand>>> GetProductBrands()
    {
        return Ok(await unitOfWork.Repository<ProductBrand>().ListAllAsync());
    }


    [Cached(600)]
    [HttpGet("types")]
    public async Task<ActionResult<IReadOnlyList<ProductType>>> GetProductTypes()
    {
        return Ok(await unitOfWork.Repository<ProductType>().ListAllAsync());
    }


    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Product>> CreateProduct(ProductCreateDto productToCreate)
    {
        var product = mapper.Map<ProductCreateDto, Product>(productToCreate);

        unitOfWork.Repository<Product>().Add(product);
        var result = await unitOfWork.Complete();

        if (result <= 0) return BadRequest(new ApiResponse(400, "Problem creating product"));

        return Ok(product);
    }


    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Product>> UpdateProduct(int id, ProductCreateDto productToUpdate)
    {
        var product = await unitOfWork.Repository<Product>().GetByIdAsync(id);

        mapper.Map(productToUpdate, product);

        unitOfWork.Repository<Product>().Update(product);
        var result = await unitOfWork.Complete();

        if (result <= 0) return BadRequest(new ApiResponse(400, "Problem updating product"));

        return Ok(product);
    }


    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Product>> DeleteProduct(int id)
    {
        var product = await unitOfWork.Repository<Product>().GetByIdAsync(id);
        if (product?.Photos is {})
            foreach (var photo in product.Photos)
            {
                if (photo.Id > 18)
                {
                    photoService.DeleteFromDisk(photo);
                }
            }

        unitOfWork.Repository<Product>().Delete(product);
        var result = await unitOfWork.Complete();

        if (result <= 0) return BadRequest(new ApiResponse(400, "Problem deleting product"));

        return Ok(product);
    }


    [HttpPut("{id}/photo")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ProductToReturnDto>> AddProductPhoto(int id, [FromForm] ProductPhotoDto photoDto)
    {
        var spec = new ProductsWithTypesAndBrandsSpecification(id);
        var product = await unitOfWork.Repository<Product>().GetEntityWithSpec(spec);

        if (photoDto.Photo?.Length <= 0) return mapper.Map<Product, ProductToReturnDto>(product);
        var photo = await photoService.SaveToDiskAsync(photoDto.Photo);

        {
            product?.AddPhoto(photo.PictureUrl, photo.FileName);

            if (product != null) unitOfWork.Repository<Product>().Update(product);

            var result = await unitOfWork.Complete();

            if (result <= 0) return BadRequest(new ApiResponse(400, "Problem adding photo product"));
        }

        return mapper.Map<Product, ProductToReturnDto>(product);
    }


    [HttpDelete("{id}/photo/{photoId}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteProductPhoto(int id, int photoId)
    {
        var spec = new ProductsWithTypesAndBrandsSpecification(id);
        var product = await unitOfWork.Repository<Product>().GetEntityWithSpec(spec);

        var photo = product.Photos.SingleOrDefault(x => x.Id == photoId);

        if (photo is { })
        {
            if (photo.IsMain)
                return BadRequest(new ApiResponse(400,
                    "You cannot delete the main photo"));

            photoService.DeleteFromDisk(photo);
        }
        else
        {
            return BadRequest(new ApiResponse(400, "Photo does not exist"));
        }

        product.RemovePhoto(photoId);

        unitOfWork.Repository<Product>().Update(product);

        var result = await unitOfWork.Complete();

        if (result <= 0) return BadRequest(new ApiResponse(400, "Problem adding photo product"));

        return Ok();
    }



    [HttpPost("{id}/photo/{photoId}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ProductToReturnDto>> SetMainPhoto(int id, int photoId)
    {
        var spec = new ProductsWithTypesAndBrandsSpecification(id);
        var product = await unitOfWork.Repository<Product>().GetEntityWithSpec(spec);

        if (product.Photos.All(x => x.Id != photoId)) return NotFound();

        product.SetMainPhoto(photoId);

        unitOfWork.Repository<Product>().Update(product);

        var result = await unitOfWork.Complete();

        if (result <= 0) return BadRequest(new ApiResponse(400, "Problem adding photo product"));

        return mapper.Map<Product, ProductToReturnDto>(product);
    }
}
