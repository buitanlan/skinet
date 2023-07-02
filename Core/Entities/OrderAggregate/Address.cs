namespace Core.Entities.OrderAggregate;

public class Address(string firstName, string lastName, string street, string city, string state, string zipCode)
{
    public string FirstName { get; set; } = firstName;
    public string LastName { get; set; } = lastName;
    public string Street { get; set; } = street;
    public string City { get; set; } = city;
    public string State { get; set; } = state;
    public string ZipCode { get; set; } = zipCode;
}
