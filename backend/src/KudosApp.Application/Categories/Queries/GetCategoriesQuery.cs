using KudosApp.Application.Categories.DTOs;
using MediatR;

namespace KudosApp.Application.Categories.Queries;

public record GetCategoriesQuery : IRequest<List<CategoryDto>>;
