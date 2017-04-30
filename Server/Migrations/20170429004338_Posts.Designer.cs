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
    [Migration("20170429004338_Posts")]
    partial class Posts
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

                    b.Property<DateTime>("CreatedDate");

                    b.Property<DateTime>("ModifiedDate");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(128);

                    b.HasKey("Id");

                    b.ToTable("Communities");
                });

            modelBuilder.Entity("Server.Core.Post", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("AuthorId");

                    b.Property<string>("Content");

                    b.Property<DateTime>("CreatedDate");

                    b.Property<string>("Headline")
                        .IsRequired()
                        .HasMaxLength(140);

                    b.Property<DateTime>("ModifiedDate");

                    b.HasKey("Id");

                    b.HasIndex("AuthorId");

                    b.ToTable("Posts");
                });

            modelBuilder.Entity("Server.Core.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("CommunityId");

                    b.Property<DateTime>("CreatedDate");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(128);

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasMaxLength(50);

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasMaxLength(50);

                    b.Property<string>("MiddleName")
                        .HasMaxLength(50);

                    b.Property<DateTime>("ModifiedDate");

                    b.Property<int>("UserRole");

                    b.HasKey("Id");

                    b.HasIndex("CommunityId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("Server.Core.Post", b =>
                {
                    b.HasOne("Server.Core.User", "Author")
                        .WithMany("AuthoredPosts")
                        .HasForeignKey("AuthorId");
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
