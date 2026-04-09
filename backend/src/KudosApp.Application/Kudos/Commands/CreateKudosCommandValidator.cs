using FluentValidation;

namespace KudosApp.Application.Kudos.Commands;

public class CreateKudosCommandValidator : AbstractValidator<CreateKudosCommand>
{
    public CreateKudosCommandValidator()
    {
        RuleFor(x => x.Message).NotEmpty().MaximumLength(500);
        RuleFor(x => x.Points).InclusiveBetween(1, 100);
        RuleFor(x => x.RecipientId).NotEmpty();
        RuleFor(x => x.CategoryId).NotEmpty();
        RuleFor(x => x.SenderId).NotEmpty();
    }
}
