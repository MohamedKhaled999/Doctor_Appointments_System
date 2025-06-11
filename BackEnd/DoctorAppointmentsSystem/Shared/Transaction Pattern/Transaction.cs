using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Transaction_Pattern
{
    public class Transaction
    {
        private readonly Stack<Action> _compensations = new Stack<Action>();

        public void Execute(Action operation, Action compensation)
        {
            try
            {
                operation();
                _compensations.Push(compensation);
            }
            catch(Exception e)
            {
                Compensate();        
                throw e.InnerException;
            }
        }

        public void Complete() => _compensations.Clear();

        public void Compensate()
        {
            while (_compensations.Count > 0)
            {
                var compensate = _compensations.Pop();
                try
                {
                    compensate();
                }
                catch (Exception e)
                {
                    throw e.InnerException;
                }
            }
        }

    }
}
