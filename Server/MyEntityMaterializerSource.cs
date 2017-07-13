using System;
using System.Linq.Expressions;
using System.Reflection;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

public class AppEntityMaterializerSource : EntityMaterializerSource
{
    private static readonly MethodInfo NormalizeDateTimeMethod = typeof(DateTimeMapper).GetTypeInfo().GetMethod(nameof(DateTimeMapper.NormalizeDateTime));
    private static readonly MethodInfo NormalizeNullableDateTimeMethod = typeof(DateTimeMapper).GetTypeInfo().GetMethod(nameof(DateTimeMapper.NormalizeNullableDateTime));

    public override Expression CreateReadValueExpression(Expression valueBuffer, Type type, int index, IProperty property = null)
    {
        var readValueExpression = base.CreateReadValueExpression(valueBuffer, type, index, property);

        if (type == typeof(DateTime))
        {
            return Expression.Call(NormalizeDateTimeMethod, readValueExpression);
        }

        if (type == typeof(DateTime?))
        {
            return Expression.Call(NormalizeNullableDateTimeMethod, readValueExpression);
        }

        return readValueExpression;
    }
}

public static class DateTimeMapper
{
    public static DateTime NormalizeDateTime(DateTime value)
    {
        return DateTime.SpecifyKind(value, DateTimeKind.Utc);
    }

    public static DateTime? NormalizeNullableDateTime(DateTime? value)
    {
        if (!value.HasValue) return null;
        return DateTime.SpecifyKind(value.Value, DateTimeKind.Utc);
    }
}