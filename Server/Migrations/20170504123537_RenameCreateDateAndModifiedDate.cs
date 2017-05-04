using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Server.Migrations
{
    public partial class RenameCreateDateAndModifiedDate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ModifiedDate",
                table: "Users",
                newName: "ModifiedDateTime");

            migrationBuilder.RenameColumn(
                name: "CreatedDate",
                table: "Users",
                newName: "CreatedDateTime");

            migrationBuilder.RenameColumn(
                name: "ModifiedDate",
                table: "Posts",
                newName: "ModifiedDateTime");

            migrationBuilder.RenameColumn(
                name: "CreatedDate",
                table: "Posts",
                newName: "CreatedDateTime");

            migrationBuilder.RenameColumn(
                name: "ModifiedDate",
                table: "EventAttendee",
                newName: "ModifiedDateTime");

            migrationBuilder.RenameColumn(
                name: "CreatedDate",
                table: "EventAttendee",
                newName: "CreatedDateTime");

            migrationBuilder.RenameColumn(
                name: "ModifiedDate",
                table: "Communities",
                newName: "ModifiedDateTime");

            migrationBuilder.RenameColumn(
                name: "CreatedDate",
                table: "Communities",
                newName: "CreatedDateTime");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ModifiedDateTime",
                table: "Users",
                newName: "ModifiedDate");

            migrationBuilder.RenameColumn(
                name: "CreatedDateTime",
                table: "Users",
                newName: "CreatedDate");

            migrationBuilder.RenameColumn(
                name: "ModifiedDateTime",
                table: "Posts",
                newName: "ModifiedDate");

            migrationBuilder.RenameColumn(
                name: "CreatedDateTime",
                table: "Posts",
                newName: "CreatedDate");

            migrationBuilder.RenameColumn(
                name: "ModifiedDateTime",
                table: "EventAttendee",
                newName: "ModifiedDate");

            migrationBuilder.RenameColumn(
                name: "CreatedDateTime",
                table: "EventAttendee",
                newName: "CreatedDate");

            migrationBuilder.RenameColumn(
                name: "ModifiedDateTime",
                table: "Communities",
                newName: "ModifiedDate");

            migrationBuilder.RenameColumn(
                name: "CreatedDateTime",
                table: "Communities",
                newName: "CreatedDate");
        }
    }
}
