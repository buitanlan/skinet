using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Data.Migrations;

public partial class UpdateOrder : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<decimal>(
            name: "Total",
            table: "Orders",
            type: "decimal(18,2)",
            nullable: false,
            defaultValue: 0m);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn(
            name: "Total",
            table: "Orders");
    }
}
