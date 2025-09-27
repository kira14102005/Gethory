import bcrypt from 'bcrypt';

export const hashValue = async (s: string , saltRounds ?: number) => {
    const hash = await bcrypt.hash(s, saltRounds || 10);
    return hash
}

export const compareHash = async (s: string, hash: string) => bcrypt.compare(s, hash).catch((e)=> false)