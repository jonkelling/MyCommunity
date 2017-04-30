using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Server.Data;
using Server.Core;

namespace Server.Migrations
{
    [DbContext(typeof(MyCommunityContext))]
    [Migration("20170429003704_DataAnnotations")]
    partial class DataAnnotations
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.1.1")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("Server.Core.Community", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(128);

                    b.HasKey("Id");

                    b.ToTable("Communities");
                });

            modelBuilder.Entity("Server.Core.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("CommunityId");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(128);

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasMaxLength(50);

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasMaxLength(50);

                    b.Property<int>("UserRole");

                    b.HasKey("Id");

                    b.HasIndex("CommunityId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("Server.Core.User", b =>
                {
                    b.HasOne("Server.Core.Community", "Community")
                        .WithMany("Users")
                        .HasForeignKey("CommunityId");
                });
        }
    }
}
