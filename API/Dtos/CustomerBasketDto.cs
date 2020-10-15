using System.Collections.Generic;

namespace API.Dtos
{
    public class CustomerBasketDto
    {
        
        public int Id { get; set; }
        public List<BasketItemDto> Items { get; set; }
       
    }
}