using System.Collections;
using Core.Entities;
using Core.Interfaces;

namespace Infrastructure.Data;

public class UnitOfWork : IUnitOfWork
{
    private readonly StoreContext _context;
    private readonly Hashtable _repositories;
    public UnitOfWork(StoreContext context, Hashtable repositories)
    {
        _context = context;
        _repositories = repositories;
    }
    public async Task<int> Complete()
    {
        return await _context.SaveChangesAsync();
    }

    public void Dispose()
    {
        _context.Dispose();
    }

    public IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity
    {
        var type = typeof(TEntity).Name;
        if (_repositories.ContainsKey(type)) return (IGenericRepository<TEntity>)_repositories[type];
        var repositoryType = typeof(GenericRepository<>);
        var repositoryInstance = Activator.CreateInstance(repositoryType.MakeGenericType(typeof(TEntity)), _context);
        _repositories.Add(type, repositoryInstance);
        return (IGenericRepository<TEntity>)_repositories[type];
    }
}
