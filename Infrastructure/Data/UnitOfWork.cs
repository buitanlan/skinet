using System.Collections;
using Core.Entities;
using Core.Interfaces;

namespace Infrastructure.Data;

public class UnitOfWork(StoreContext context) : IUnitOfWork
{
    private readonly Hashtable _repositories = new();

    public async Task<int> Complete()
    {
        return await context.SaveChangesAsync();
    }

    public void Dispose()
    {
        context.Dispose();
    }

    public IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity
    {
        var type = typeof(TEntity).Name;
        if (_repositories.ContainsKey(type)) return (IGenericRepository<TEntity>)_repositories[type];
        var repositoryType = typeof(GenericRepository<>);
        var repositoryInstance = Activator.CreateInstance(repositoryType.MakeGenericType(typeof(TEntity)), context);
        _repositories.Add(type, repositoryInstance);
        return (IGenericRepository<TEntity>)_repositories[type];
    }
}
