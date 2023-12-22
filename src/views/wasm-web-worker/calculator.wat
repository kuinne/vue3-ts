(module
  (table $table (;0;) (export "table") 1 funcref)
  (memory $memory (;0;) (export "memory") 0)
  (global $global0 i32 (i32.const 8))
  (elem $elem0 (i32.const 0) funcref (ref.func $null))
  (func $assembly/index/add (;0;) (export "add") (param $var0 i32) (param $var1 i32) (result i32)
    local.get $var0
    local.get $var1
    i32.add
  )
  (func $null (;1;)
  )
)