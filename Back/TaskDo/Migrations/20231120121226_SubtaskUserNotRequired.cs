﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskDo.Migrations
{
    public partial class SubtaskUserNotRequired : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Subtasks_AspNetUsers_UserId",
                table: "Subtasks");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Subtasks",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddForeignKey(
                name: "FK_Subtasks_AspNetUsers_UserId",
                table: "Subtasks",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Subtasks_AspNetUsers_UserId",
                table: "Subtasks");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Subtasks",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Subtasks_AspNetUsers_UserId",
                table: "Subtasks",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
