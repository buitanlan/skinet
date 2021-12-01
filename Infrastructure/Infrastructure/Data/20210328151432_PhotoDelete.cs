using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Infrastructure.Data;

public partial class PhotoDelete : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropForeignKey(
            name: "FK_Photo_Products_ProductId",
            table: "Photo");

        migrationBuilder.AddColumn<int>(
            name: "ProductId1",
            table: "Photo",
            type: "int",
            nullable: true);

        migrationBuilder.CreateIndex(
            name: "IX_Photo_ProductId1",
            table: "Photo",
            column: "ProductId1");

        migrationBuilder.AddForeignKey(
            name: "FK_Photo_Products_ProductId",
            table: "Photo",
            column: "ProductId",
            principalTable: "Products",
            principalColumn: "Id",
            onDelete: ReferentialAction.Cascade);

        migrationBuilder.AddForeignKey(
            name: "FK_Photo_Products_ProductId1",
            table: "Photo",
            column: "ProductId1",
            principalTable: "Products",
            principalColumn: "Id",
            onDelete: ReferentialAction.Restrict);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropForeignKey(
            name: "FK_Photo_Products_ProductId",
            table: "Photo");

        migrationBuilder.DropForeignKey(
            name: "FK_Photo_Products_ProductId1",
            table: "Photo");

        migrationBuilder.DropIndex(
            name: "IX_Photo_ProductId1",
            table: "Photo");

        migrationBuilder.DropColumn(
            name: "ProductId1",
            table: "Photo");

        migrationBuilder.AddForeignKey(
            name: "FK_Photo_Products_ProductId",
            table: "Photo",
            column: "ProductId",
            principalTable: "Products",
            principalColumn: "Id",
            onDelete: ReferentialAction.Restrict);
    }
}
