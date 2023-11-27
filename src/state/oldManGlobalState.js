export default function oldManGlobalStateManager() {
    let instance = null;

    function createInstance() {
        let numTalkedOldMan = 0

        return {
            setNumTalkedOldMan(value) {
                numTalkedOldMan = value
            },
            getNumTalkedOldMan: () => numTalkedOldMan,
        }
    }

    return {
        getInstance() {
            if(!instance) {
                instance = createInstance()
            }

            return instance
        }
    }
}