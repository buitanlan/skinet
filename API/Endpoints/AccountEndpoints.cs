using API.Dtos;
using API.Errors;
using API.Extensions;
using API.Helpers;
using AutoMapper;
using Core.Entities.Identity;
using Core.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace API.Endpoints;

public static class AccountEndpoints
{
    public static RouteGroupBuilder MapAccountEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/account").WithTags("Account");

        group.MapGet("/", GetCurrentUser).RequireAuthorization();
        group.MapGet("/emailexists", CheckEmailExistsAsync);
        group.MapGet("/address", GetAddressUser).RequireAuthorization();
        group.MapPut("/address", UpdateUserAddress).RequireAuthorization().WithValidation<AddressDto>();
        group.MapPost("/login", Login).WithValidation<LoginDto>();
        group.MapPost("/register", Register).WithValidation<RegisterDto>();

        return group;
    }

    private static async Task<IResult> GetCurrentUser(
        HttpContext httpContext,
        UserManager<AppUser> userManager,
        ITokenService tokenService)
    {
        var user = await userManager.FindByEmailFromClaimsPrinciple(httpContext.User);
        return Results.Ok(new UserDto
        {
            Email = user.Email,
            Token = await tokenService.CreateToken(user),
            DisplayName = user.DisplayName
        });
    }

    private static async Task<IResult> CheckEmailExistsAsync(string email, UserManager<AppUser> userManager) =>
        Results.Ok(await userManager.FindByEmailAsync(email) is { });

    private static async Task<IResult> GetAddressUser(
        HttpContext httpContext,
        UserManager<AppUser> userManager,
        IMapper mapper)
    {
        var user = await userManager.FindByUserByClaimsPrincipleWithAddressAsync(httpContext.User);
        return Results.Ok(mapper.Map<Address, AddressDto>(user.Address));
    }

    private static async Task<IResult> UpdateUserAddress(
        AddressDto address,
        HttpContext httpContext,
        UserManager<AppUser> userManager,
        IMapper mapper)
    {
        var user = await userManager.FindByUserByClaimsPrincipleWithAddressAsync(httpContext.User);
        user.Address = mapper.Map<AddressDto, Address>(address);
        var result = await userManager.UpdateAsync(user);
        if (result.Succeeded) return Results.Ok(mapper.Map<Address, AddressDto>(user.Address));
        return Results.BadRequest("Problem updating the user");
    }

    private static async Task<IResult> Login(
        LoginDto loginDto,
        UserManager<AppUser> userManager,
        SignInManager<AppUser> signInManager,
        ITokenService tokenService)
    {
        var user = await userManager.FindByEmailAsync(loginDto.Email);
        if (user is null) return Results.Unauthorized();

        var result = await signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
        if (!result.Succeeded) return Results.Unauthorized();

        return Results.Ok(new UserDto
        {
            Email = user.Email,
            Token = await tokenService.CreateToken(user),
            DisplayName = user.DisplayName
        });
    }

    private static async Task<IResult> Register(
        RegisterDto registerDto,
        UserManager<AppUser> userManager,
        ITokenService tokenService)
    {
        if (await userManager.FindByEmailAsync(registerDto.Email) is { })
        {
            return Results.BadRequest(new ApiValidationErrorResponse
            {
                Errors = ["Email address is in use"]
            });
        }

        var user = new AppUser
        {
            DisplayName = registerDto.DisplayName,
            Email = registerDto.Email,
            UserName = registerDto.Email
        };
        var result = await userManager.CreateAsync(user, registerDto.Password);
        if (!result.Succeeded) return Results.BadRequest(new ApiResponse(400));

        return Results.Ok(new UserDto
        {
            DisplayName = user.DisplayName,
            Token = await tokenService.CreateToken(user),
            Email = user.Email
        });
    }
}
