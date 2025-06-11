using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Exceptions
{

    /// <summary>
    ///   Custom exception class for validation errors.
    ///   with a collection of error messages.
    ///   
    /// <param
    ///         name="errors">A collection of error messages.
    /// </param>
    ///   
    /// 
    /// </summary>
    public class ValidationException:Exception
    {
        public IEnumerable<string> Errors { get; set; }


        /// <summary>
        ///   Initializes a new instance of the <see cref="ValidationException"/> class.
        /// <param name="errors"></param>
        /// with a collection of error messages.
        /// </summary>
        /// 
        public ValidationException(IEnumerable<string> errors):base(" Validation Error !!")
        {
            
            Errors = errors;
        
        }

    }
}
