using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskDo.Migrations
{
    public partial class AddedImageToUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notes_Subtasks_SubtaskId",
                table: "Notes");

            migrationBuilder.AlterColumn<Guid>(
                name: "SubtaskId",
                table: "Notes",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageURL",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Notes_Subtasks_SubtaskId",
                table: "Notes",
                column: "SubtaskId",
                principalTable: "Subtasks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notes_Subtasks_SubtaskId",
                table: "Notes");

            migrationBuilder.DropColumn(
                name: "ImageURL",
                table: "AspNetUsers");

            migrationBuilder.AlterColumn<Guid>(
                name: "SubtaskId",
                table: "Notes",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddForeignKey(
                name: "FK_Notes_Subtasks_SubtaskId",
                table: "Notes",
                column: "SubtaskId",
                principalTable: "Subtasks",
                principalColumn: "Id");
        }
    }
}
