class Test {
    i = [10, 20, 30];
    x = new Map<string, number>();

    test() {
        console.log(this.i[0]);
        this.i.push(10);
        this.x.set("0x1", 10);
        console.log(this.x.get("0x1"));
    }
}