using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace Server
{
    public static class StreamExtensions
    {
        public static byte[] ReadAllBytes(this Stream s) => s.ReadAllBytesEnumerable().ToArray();
        private static IEnumerable<byte> ReadAllBytesEnumerable(this Stream s)
        {
            int b;
            while ((b = s.ReadByte()) != -1)
                yield return (byte)b;
        }
    }
}