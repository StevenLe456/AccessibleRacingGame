import HavokPlugin from "@babylonjs/havok";

export const havokModule = HavokPlugin({
    locateFile: () => {
      return 'wasm/HavokPhysics.wasm'
    },
})