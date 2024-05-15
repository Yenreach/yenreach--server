const generateDP = (name: string) => {
    const extractedString = name.split(" ").join("+");

    const link =`https://api.dicebear.com/5.x/initials/png?seed=${extractedString}`

    return link
}

export { generateDP }
